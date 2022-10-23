// import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { MarkdownView, Notice, Plugin, WorkspaceLeaf, Modal, App, Setting } from "obsidian";
// import { GMIView, VIEW_TYPE_GMI } from "./view";

// Remember to rename these classes and interfaces!

class ExampleModal extends Modal {
	result: string;
	onSubmit: (result: string) => void;
  
	constructor(app: App, onSubmit: (result: string) => void) {
	  super(app);
	  this.onSubmit = onSubmit;
	}
  
	onOpen() {
	  const { contentEl } = this;
  
	  contentEl.createEl("h1", { text: "Enter name of new .gmi file" });
  
	  new Setting(contentEl)
		// .setName("Name")
		.addText((text) =>
		  text.onChange((value) => {
			this.result = value
		  }));
  
	  new Setting(contentEl)
		.addButton((btn) =>
		  btn
			.setButtonText("Submit")
			.setCta()
			.onClick(() => {
			  this.close();
			  this.onSubmit(this.result);
			}));
	}
  
	onClose() {
	  let { contentEl } = this;
	  contentEl.empty();
	}
  }

export default class GeminiEditor extends Plugin {

	createGMI(folder? : string) {
		// const fm = app.fileManager as any
		if ( !folder ) {
			folder = app.fileManager.getNewFileParent(app.workspace.getActiveFile()?.path || '').path
		}
		if (folder == "/") {
			folder = ""
		}

		const files = app.vault.getFiles()
		const filepaths : string[] = []
		files.forEach( (file) => {
			// new Notice(file.parent.path)
			// if ( file.parent.path == folder ) {
				filepaths.push(file.path)
				// new Notice(file.path)
			// }
		})

		if (!filepaths.contains(folder + "Untitled.gmi")) {
			app.vault.create(folder + "Untitled.gmi", "")
		} else {
			let iter = 0
			while (true) {
				iter = iter + 1
				let newname = "Untitled " + iter
				if (!filepaths.contains(folder + newname + ".gmi")) {
					app.vault.create(folder + newname + ".gmi", "")
					break
				}
			}
		}


	}

	async onload() {
		console.log('loading plugin: Gemini');
		// this.registerView(
		// 	VIEW_TYPE_GMI, 
		// 	(leaf: WorkspaceLeaf) => new GMIView(leaf)
		// );
		this.registerExtensions(["gmi"], "markdown");

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('add-note-glyph', 'New Gemtext', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			this.createGMI()
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
			  menu.addItem((item) => {
				item
				  .setTitle("New Gemtext")
				  .setIcon("add-note-glyph")
				  .onClick(async () => {
					  let folder : string
					  const fname = file.path
					  if( fname.search("(\\.[^.]+)$") > 0 ) {
						folder = file.parent.path
						if (folder != "/") {
							folder = folder + "/"
						}
					  } else {
						folder = fname + "/"
					  }
					  this.createGMI(folder)
				  });
			  });
			})
		  );
	}

	onunload() {
		console.log('unloading plugin: Gemini');
	}

}
