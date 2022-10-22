// import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { MarkdownView, Notice, Plugin, WorkspaceLeaf } from "obsidian";
import { GMIView, VIEW_TYPE_GMI } from "./view";

// Remember to rename these classes and interfaces!

export default class GeminiEditor extends Plugin {

	async onload() {
		console.log('loading plugin: Gemini');
		this.registerView(
			VIEW_TYPE_GMI, 
			(leaf: WorkspaceLeaf) => new GMIView(leaf)
		);
		this.registerExtensions(["gmi"], VIEW_TYPE_GMI);
	}

	onunload() {
		console.log('unloading plugin: Gemini');
	}

}
