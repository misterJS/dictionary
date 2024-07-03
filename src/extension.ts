import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface Suggestions {
  [key: string]: string;
}

const suggestionsFilePath = path.join(__dirname, '..', 'suggestions.json');
const suggestions: Suggestions = JSON.parse(fs.readFileSync(suggestionsFilePath, 'utf-8'));

export function activate(context: vscode.ExtensionContext) {
  console.log('Ekstensi diaktifkan!');
  
  const provider = vscode.languages.registerCompletionItemProvider(
    [
      { scheme: 'file', language: 'html' },
      { scheme: 'file', language: 'javascript' }
    ],
    {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        console.log('Menyediakan item penyelesaian...');
        
        const line = document.lineAt(position);
        const textBeforeCursor = line.text.substring(0, position.character).trim();
        
        const match = textBeforeCursor.match(/=\s*["']([^"']*)$/);
        const input = match ? match[1] : '';
        
        console.log(`Input yang diterima: ${input}`);
        
        const completionItems: vscode.CompletionItem[] = [];

        if (input.startsWith("D:")) {  
          const query = input.slice(2); 
          
          for (const [key, value] of Object.entries(suggestions)) {
            if (key.toLowerCase().includes(query.toLowerCase())) {
              console.log(`Menambahkan item: Key - ${key}, Value - ${value}`);
              
              const item = new vscode.CompletionItem(`D:${key}`, vscode.CompletionItemKind.Text);
              item.detail = value;
              item.insertText = `${value}`;
              completionItems.push(item);
            }
          }
        }
        
        console.log('Total item yang disediakan:', completionItems.length);
        return completionItems;
      }
    },
    '"', ' '  
  );

  context.subscriptions.push(provider);
}

export function deactivate() {
  console.log('Ekstensi dinonaktifkan!');
}
