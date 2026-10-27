import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { root, packageArchive, packedManifest, sha256, reportDirectory as getReportDirectory } from './verification/metadata.mjs';

// This fixture consumes only the packed package, with strict consumer types.
const reportDirectory = getReportDirectory();
const archive = packageArchive(), library = packedManifest(archive);
const directory = mkdtempSync(join(tmpdir(), 'orvui-distribution-'));
const catalog = JSON.parse(readFileSync(join(root, 'tools/catalog/components.json'), 'utf8'));
const workspace = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const components = catalog.categories.flatMap(category => category.components.map(component => `${category.slug}/${component.slug}`));
const log = [];
function command(args) {
  try {
    const output = execFileSync('pnpm', args, { cwd: directory, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 30 * 1024 * 1024 });
    log.push(`$ pnpm ${args.join(' ')}\n${output}`);
    return output;
  } catch (error) {
    log.push(error.stdout?.toString() ?? '', error.stderr?.toString() ?? '', String(error));
    throw error;
  }
}
function put(name, content) {
  mkdirSync(resolve(directory, name, '..'), { recursive: true });
  writeFileSync(join(directory, name), content);
}
put('package.json', JSON.stringify({ name: 'orvui-distribution-consumer', private: true, type: 'module', packageManager: workspace.packageManager, dependencies: { vue: library.peerDependencies.vue, [library.name]: `file:${archive}`, '@vue/server-renderer': workspace.devDependencies['@vue/server-renderer'] }, devDependencies: Object.fromEntries(['vite', '@vitejs/plugin-vue', 'typescript', 'vue-tsc'].map(name => [name, workspace.devDependencies[name]])) }, null, 2));
put('index.html', '<html><head><meta charset="UTF-8"></head><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>');
put('tsconfig.json', JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', strict: true, skipLibCheck: true, noUncheckedSideEffectImports: true, types: ['vite/client'], lib: ['ES2022', 'DOM', 'DOM.Iterable'], jsx: 'preserve', allowSyntheticDefaultImports: true }, include: ['src'] }));
put('vite.config.ts', `import {defineConfig} from 'vite';import vue from '@vitejs/plugin-vue';export default defineConfig({plugins:[vue(),{name:'orvui-runtime-audit',generateBundle(){for(const id of this.getModuleIds()){if(id.includes(${JSON.stringify(join(root, 'packages/vue/src'))}))throw new Error('Consumer resolved workspace source: '+id);if(['/node_modules/react/','/node_modules/react-dom/','/node_modules/next/'].some(part=>id.includes(part)))throw new Error('Unexpected React/Next runtime: '+id)}}}]})`);
put('src/exports.ts', `import * as library from '${library.name}';\n` + components.map((path, index) => `import * as component${index} from '${library.name}/${path}';`).join('\n') + '\nexport const all = [library,' + components.map((_, index) => `component${index}`).join(',') + '];\n');
put('src/main.ts', `import {createApp,h} from 'vue';import {Button} from '${library.name}/motion/button';import {all} from './exports';import '${library.name}/style.css';if(all.length!==${components.length + 1})throw new Error('Incomplete exports');createApp({render:()=>h(Button,{},()=> 'Continue')}).mount('#app')`);
put('src/contracts.ts', `import * as root from '${library.name}'
import {Button, type ButtonProps} from '${library.name}/motion/button'
import type {OTPInputProps} from '${library.name}/blocks/otp-input'
import type {PromptInputProps} from '${library.name}/agents/prompt-input'
import type {DonutChartProps} from '${library.name}/charts/donut-chart'
const rootButton: typeof Button = root.Button
const button: ButtonProps = {disabled: false}
const otp: OTPInputProps = {modelValue: '123456', length: 6}
const prompt: PromptInputProps = {modelValue: 'Hello'}
// @ts-expect-error OTP values are strings.
const invalidOTP: OTPInputProps = {modelValue: 123456}
// @ts-expect-error Prompt values are strings.
const invalidPrompt: PromptInputProps = {modelValue: 42}
// @ts-expect-error Segment values are numeric.
const invalidChart: DonutChartProps = {segments: [{id:'x', name:'X', color:'#000', value:'bad'}]}
void [rootButton, button, otp, prompt, invalidOTP, invalidPrompt, invalidChart]
`);
put('ssr.mjs', `import {createSSRApp,h} from 'vue';import {renderToString} from '@vue/server-renderer';import {Button} from '${library.name}/motion/button';import {OTPInput} from '${library.name}/blocks/otp-input';import {PromptInput} from '${library.name}/agents/prompt-input';import {DonutChart} from '${library.name}/charts/donut-chart';const html=await renderToString(createSSRApp({render:()=>h('main',[h(Button,{},()=> 'SSR verification'),h(OTPInput),h(PromptInput),h(DonutChart,{segments:[{id:'a',name:'First',color:'#2563eb',value:40}]})])}));if(!html.includes('SSR verification'))throw new Error('SSR output missing component');console.log('Package SSR passed');`);
let passed = false, ssrPassed = false;
try {
  command(['install', '--no-frozen-lockfile', '--prefer-offline']);
  command(['exec', 'vue-tsc', '--noEmit']);
  command(['exec', 'vite', 'build']);
  const output = execFileSync(process.execPath, ['ssr.mjs'], { cwd: directory, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  log.push(output);
  ssrPassed = true;
  passed = true;
} catch (error) {
  log.push(error.stdout?.toString() ?? '', error.stderr?.toString() ?? '', String(error));
  process.exitCode = 1;
} finally {
  const result = { result: passed ? 'passed' : 'failed', passed, archive, sha256: sha256(archive), directory, packageName: library.name, checkedComponentSubpaths: components.length, checkedPublicTypeContracts: true, strict: true, skipLibCheck: true, ssrPassed, reactFreeRuntime: true };
  writeFileSync(join(reportDirectory, 'distribution.log'), log.join('\n'));
  writeFileSync(join(reportDirectory, 'distribution.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
}
