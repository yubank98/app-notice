import { Component, Input } from '@angular/core';
import { ActionSheetButton, ActionSheetController, Platform } from '@ionic/angular';

import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

import { Article } from '../../interfaces';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {

  @Input() article!: Article;
  @Input() index!: number;


  constructor(
    private iab: InAppBrowser, 
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing,
    ) { }

  openArticle(){
    if( this.platform.is('ios') || this.platform.is('android') ) {
      const browser = this.iab.create(this.article.url);
      browser.show();
      return;
    }
    window.open(this.article.url, '_blank');
  }

  async onOpenMenu(){
    const normalBtns: ActionSheetButton[] = [
      {
        text: 'Favorito',
        icon: 'heart-outline',
        handler: () => this.onToggleFavorite()
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel'
      }
    ]
    const shareBtn: ActionSheetButton = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => this.onShareArticle()
    }
    if(this.platform.is('capacitor')){
      normalBtns.unshift(shareBtn);
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: normalBtns
    });

    await actionSheet.present();
  }

  onShareArticle(){
    this.socialSharing.share(
      this.article.title,
      this.article.source.name,
      this.article.url
    );
  }

  onToggleFavorite(){
    console.log('Toggle article')
  }
}
