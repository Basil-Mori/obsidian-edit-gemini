import { TextFileView, Notice } from "obsidian";
import { arrayBuffer } from "stream/consumers";

export const VIEW_TYPE_GMI = "gmi-view";

export class GMIView extends TextFileView {
  fileLines: string[];
  fileDIV: HTMLElement;

  getViewData() {
    // return this.data;
    return this.fileLines.join("\n")
  }

  setViewData(data: string, clear: boolean) {
    // this.data = data;
    this.fileLines = data.split("\n");
    // this.fileLines.forEach((line, i) => {
    //   this.fileLines[i] = line + "\n"
    // });

    // this.contentEl.empty();
    // this.contentEl.createDiv({ text: this.data });
    this.refresh()
  }

  async onOpen() {
    this.fileDIV = this.contentEl.createEl("div", {cls: "fileDIV", attr: {contenteditable: "true"}, });

    this.fileDIV.oninput = (ev) => {
      // this.fileDIV.oninput = (ev) => {
      if (ev.currentTarget instanceof HTMLDivElement) {
        new Notice("input changed");
        // this.fileLines[i] = ev.currentTarget.getText();
        // this.data = ev.currentTarget.getText();
        // new Notice(ev.currentTarget.getText())

        const allchilds = ev.currentTarget.childNodes
        this.fileLines = []
        allchilds.forEach( (child: HTMLParagraphElement) => {
          if (child.textContent) {
            // new Notice(child.textContent)
            this.fileLines.push(child.textContent)
          } else {
            // new Notice( "")
            this.fileLines.push("")
          }
        })

        // this.refresh()
        this.requestSave();
      }
    }
  }
  
  async onClose() {
    this.contentEl.empty();
  }

  refresh() {
    this.fileDIV.empty();

    this.fileLines.forEach((line, i) => {
      if (line == "") {
        this.fileDIV.createEl("br")
      } else {
        const lineelement = this.fileDIV.createEl("p", 
          {text: line, 
          // {text: this.data,
            cls: "fileLine", 
            // attr: {contenteditable: "true"}
          });

      // lineelement.append()
      // lineelement.createEl("a", { text: "test", attr: {href: "https://google.com"}})
      // };
    //   lineelement.oninput = (ev) => {
    //     // this.fileDIV.oninput = (ev) => {
    //     if (ev.currentTarget instanceof HTMLParagraphElement) {
    //       new Notice("input changed");
    //       this.fileLines[i] = ev.currentTarget.getText();
    //       // this.data = ev.currentTarget.getText();
    //       this.requestSave();
    //     }
      }
    });
  }

  clear() {
    this.fileLines = [];
    // this.data = "";
  }

  getViewType() {
    return VIEW_TYPE_GMI;
  }
}