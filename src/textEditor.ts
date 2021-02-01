import * as vscode from 'vscode';
function webView() {
  let editor = vscode.window.activeTextEditor // 获取当前激活的编辑器
  if (!editor) {
    vscode.window.showErrorMessage('no active editor!')
  }
  let doc = ''
  if (editor?.document) {
    doc = editor.document.getText() //得到当前激活的编辑器的文档
  }
  let webViewPanle = vscode.window.createWebviewPanel('htmlPreview','预览结果',vscode.ViewColumn.Beside,{
    enableScripts: true //允许加载js
  })
  webViewPanle.webview.html = doc

}
export const webViewTab = vscode.commands.registerCommand('texteditor.show',webView)