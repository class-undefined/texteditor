// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// import { ws } from './textEditor'
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	/**
	 * 打开html文件,ctrl+s即可触发预览html的功能，但由于vscode自身的安全策略，不能够直接的调用外部的文件（外部css，外部js等），
	 * 如需调用，需要修改html文件的相关内容，符合vs的安全策略规定才可以。
	 * 安全策略：https://code.visualstudio.com/api/extension-guides/webview#content-security-policy
	 */
	let currentPanel: vscode.WebviewPanel | undefined = undefined;
	let disposable = vscode.commands.registerCommand('texteditor.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from textEditor!');
	});
	/**预览HTML */
	let ws = vscode.commands.registerCommand('texteditor.ws', () => {
		/**获取当前激活的编辑器 */
		let editor = vscode.window.activeTextEditor
		/**如果没有激活的编辑器 */
		if (!editor) {
			vscode.window.showErrorMessage('no active editor!')
			return
		}
		let doc = ''
		/**如果有document属性 */
		if (editor?.document) {
			doc = editor.document.getText() //得到当前激活的编辑器的文档
		}
		/**如果存在webView,则激活它，并更新内容，若没有，则创建一个新的 */
		/**判断webViwe是否存在，若不存在则创建并设置html，否则更新文档的html结果 */
		let state = context.globalState.get('disposed')
		console.log(state,currentPanel);
		
		if(state===undefined||state){
			currentPanel = vscode.window.createWebviewPanel('htmlPreview', "预览结果", vscode.ViewColumn.Beside, {
				enableScripts: true
			});
			
			currentPanel.webview.html = doc;
		}
		/**webView即将被关闭事件 */
		currentPanel?.onDidDispose(e=>{
			context.globalState.update('disposed',true)
		});
		
		if (currentPanel) {
			currentPanel.reveal(vscode.ViewColumn.Beside);
			currentPanel.webview.html = doc
			/**创建完成后则状态改为未关闭 即disposed置为false */
			context.globalState.update('disposed',false)
		} else {
			currentPanel = vscode.window.createWebviewPanel('htmlPreview', "预览结果", vscode.ViewColumn.Beside, {
				enableScripts: true
			});
			currentPanel.webview.html = doc;
			context.globalState.update('disposed',false)
		}
	})
	context.subscriptions.push(ws)
	context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() { }
