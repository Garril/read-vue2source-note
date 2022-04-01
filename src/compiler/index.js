/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
// 创建一个编译器
export const createCompiler = createCompilerCreator(function baseCompile (
  // baseCompile描述了如何将 模板 转化成 render函数 的
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options) // 将模板转化成ast树---抽象语法树（用对象描述真实的js语法---vdom就是对象描述dom）
  if (options.optimize !== false) { // 优化树
    optimize(ast, options)
  }
  const code = generate(ast, options) // 把 ast树 生成回 js代码
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
// 到 example/compiler/baseCompile.js文件看 简略版的原理代码 --- 从div到render函数
