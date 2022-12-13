// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


let generatedType = "Icase";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "php-interface-classes" is now active!');
	let text = vscode.window.activeTextEditor!.document.getText();
	let lines = text.split('\r\n');
	lines = lines.map((line) => line.trim());
	let phpInterface = getClassNameFromInterface(lines);
	let phpClass = convertInterfaceToClass(phpInterface);
	replaceTextAndShow(text, phpInterface, phpClass);
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let generateI = vscode.commands.registerCommand('php-interface-classes.generateI', () => {
		IConventiion();
	});
	let generateInterface = vscode.commands.registerCommand('php-interface-classes.generateInterface', () => {
		InterfaceConvention();
	});
	let generate = vscode.commands.registerCommand('php-interface-classes.generate', () => {
		NoConevntion();
	});

	context.subscriptions.push(generateI);
	context.subscriptions.push(generateInterface);
	context.subscriptions.push(generate);

}

function generate() {
	let text = vscode.window.activeTextEditor!.document.getText();
	let lines = text.split('\r\n');
	lines = lines.map((line) => line.trim());
	let phpInterface = getClassNameFromInterface(lines);
	let phpClass = convertInterfaceToClass(phpInterface);
	replaceTextAndShow(text, phpInterface, phpClass);
}

function IConventiion() {
	generatedType = 'ICase';
	generate();

}

function InterfaceConvention() {
	generatedType = 'InterfaceCase';
	generate();
}

function NoConevntion() {
	generatedType = '';
	generate();
}

function getClassNameFromInterface(lines: string[]) {
	let phpinterface: string = '';
	lines.forEach(line => {
		if (/interface +(\w+)/.test(line)) {
			const matchedInterfaceResult = line.match(/interface +(\w+)/) || [];
			phpinterface = matchedInterfaceResult[1] || '';
		}
	})
	return phpinterface;
}

function convertInterfaceToClass(phpinterface: string) {
	let className = '';
	switch (generatedType) {
		case 'ICase':
			if (phpinterface[0] === "I") {
				className = phpinterface.substring(1);
				className = className.charAt(0).toUpperCase() + className.slice(1);
			}
			break;
		case 'InterfaceCase': 
			className = phpinterface.replace("Interface", '');
			break;
		default:
			className = phpinterface
			break;
	}
	return className;
}

function replaceTextAndShow(text: string, phpinterface: string, phpclass: string) {
	let classText = text.replace('interface ' + phpinterface, 'final class ' + phpclass);
	classText = classText.replace(/(.*function.* *)(;)/gm, '$1 {' + 
`
		// throw new Exception("Not implemented;");
	}
`);
	
	var setting: vscode.Uri = vscode.Uri.parse('untitled:' + phpclass + '.php');
	vscode.workspace.openTextDocument(setting).then((a: vscode.TextDocument) => {
		vscode.window.showTextDocument(a, 1, false).then(e => {
			e.edit(edit => {
				edit.insert(new vscode.Position(0, 0), classText);
			});
		});
	}, (error: any) => {
		console.error(error);
		debugger;
	});

}




// This method is called when your extension is deactivated
export function deactivate() {}
