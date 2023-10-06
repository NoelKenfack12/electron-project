import { Component } from '@angular/core';
import { ElectronService } from './services';

export {};
declare var window: Window;
declare global {
  interface Window {
    require: any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Angular Electron';

  constructor(
    private electronService: ElectronService
  ) {

    if (electronService.isElectron) {
      
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);

    } else {
      console.log('Run in browser');
    }
  }
  
  async  onSnipClick(){
    console.log('todo: making screenshot');
    const screen = this.electronService.remote.screen;

    const screenSize = screen.getPrimaryDisplay().workAreaSize;

    const maxDimension = Math.max(
      screenSize.width, 
      screenSize.height
    );

    const win = this.electronService.remote.getCurrentWindow();
    const windowRect = win.getBounds();
    win.hide();
    
    try {
      const sources = await this.electronService.desktopCapturer.getSources({ 
                      types: ['screen'],
                      thumbnailSize: {
                        width: maxDimension * window.devicePixelRatio,
                        height: maxDimension * window.devicePixelRatio
                      } 
                    });
      const entireScreenSource = sources.find(
        source => source.name === 'Entire Screen' 
          || source.name === 'Screen 1'
      );

      if (entireScreenSource) {
        console.log(entireScreenSource);
        
        const outputPath = this.electronService.path.join(this.electronService.os.tmpdir(), 'screenshot.png');
        const image = entireScreenSource.thumbnail
        .resize({
          width: screenSize.width,
          height: screenSize.height
        })
        .crop(windowRect)
        .toPNG();

        //console.log(this.electronService.os.tmpdir());

        this.electronService.fs.writeFile(outputPath, image, err => {
          win.show();

          if (err) return console.error(err);
          this.electronService.shell.openExternal(`file://${outputPath}`);
        });
        
      }else {
          window.alert('Screen source not found.');
      }
    } catch (err) {
      console.error(err);
    }
  };
}
