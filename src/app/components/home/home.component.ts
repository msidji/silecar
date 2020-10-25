import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';

enum MagicStates {
  Initial = 'INITIAL',
  Failure = 'FAILURE',
  Succes = 'SUCCESS'
}

enum MagicTransitions {
  InitialToFailure = MagicStates.Initial + '=>' + MagicStates.Failure,
  InitialToSuccess = MagicStates.Initial + '=>' + MagicStates.Succes,
  InititalToFailureAndSucces = MagicStates.Initial + '=>' + MagicStates.Failure + ', ' + MagicStates.Initial + '=>' + MagicStates.Failure,
}

const C_DEFAULT_IMG_WIDTH = 256;
const C_DEFAULT_IMG_HEIGHT = 212.8;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('imgMagicAnimation', [
      state(MagicStates.Initial, style({
      })),
      state(MagicStates.Failure, style({
        width: '0px',
        height: '0px',
      })),
      state(MagicStates.Succes, style({
      })),
      transition(MagicTransitions.InitialToFailure.toString(), animate('2500ms ease')),
      transition(MagicTransitions.InitialToSuccess.toString(), [style({ transform: 'rotate(-7200deg)' }), animate('5000ms ease-in-out')]),
    ]),

    trigger('imgFailureShow', [
      state(MagicStates.Initial, style({
        width: '0px',
        height: '0px',
      })),
      state(MagicStates.Failure, style({
        width: '202px',
        height: '320px',
      })),
      transition(MagicTransitions.InitialToFailure.toString(), animate('5000ms ease-in-out')),
    ]),

    trigger('h1DefaultHide', [
      state(MagicStates.Initial, style({})),
      state(MagicStates.Failure, style({
        'font-size': '0'
      })),
      state(MagicStates.Succes, style({
        'font-size': '0'
      })),
      transition(MagicTransitions.InititalToFailureAndSucces.toString(), animate(1000, keyframes(
        [
          style({ 'font-size': '0' }),
        ])),
      ),
    ]),

    trigger('h1FailureShow', [
      state(MagicStates.Initial, style({ 'font-size': '0' })),
      state(MagicStates.Failure, style({
        display: 'block',
        'font-size': '80pt'
      })),
      transition(MagicTransitions.InitialToFailure.toString(), animate(1500, keyframes(
        [
          style({ 'font-size': '80pt' }),
        ])),
      ),
    ]),

    trigger('h1SuccessShow', [
      state(MagicStates.Initial, style({ 'font-size': '0' })),
      state(MagicStates.Succes, style({
        display: 'block',
        'font-size': '80pt'
      })),
      transition(MagicTransitions.InitialToSuccess.toString(), animate(1500, keyframes(
        [
          style({ 'font-size': '80pt' }),
        ])),
      ),
    ]),
  ]
})
export class HomeComponent implements OnInit {
  currentState: MagicStates;
  private clickCount: number;
  private maxClicks: number;
  private scrWidth: number;
  private scrHeight: number;
  private widthAddition: number;
  private heightAddition: number;
  private interval: any;
  private successTimeGoal: number;

  constructor() { this.getScreenSize(); }

  ngOnInit(): void {
    this.changeState(MagicStates.Initial);
  }

  //#region EVENT HANDLERS
  onClickMagicBtn(event: any): void {
    this.clickCount++;

    if (this.clickCount === this.maxClicks) {
      console.log('max clicks:' + this.maxClicks);

      this.changeState(MagicStates.Failure);
      return;
    }

    this.increaseImgSize('imgMagic');
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?): void {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
    console.log(this.scrHeight, this.scrWidth);
  }
  //#endregion

  //#region STATE MGMT
  changeState(newState: MagicStates): void {
    clearInterval(this.interval);

    switch (newState) {
      case MagicStates.Initial:
        this.currentState = newState;
        this.clickCount = 0;
        this.maxClicks = this.getRandomIntInclusive(1, 10);
        this.widthAddition = (this.scrWidth / 100) * 3;
        this.heightAddition = (this.scrHeight / 100) * 5;
        this.successTimeGoal = this.getRandomIntInclusive(45000, 180000);
        this.startMagicTimer();
        break;

      case MagicStates.Failure:
        this.currentState = newState;
        this.magicFailAction();
        break;

      case MagicStates.Succes:
        this.currentState = newState;
        this.magicSuccessAction();
        break;
    }

  }

  magicFailAction(): void {
    this.disableMagicBtn();
    this.changeImgSrc('imgFailure', '../../../assets/knife-hearth-red.svg');
  }

  magicSuccessAction(): void {
    this.disableMagicBtn();
    this.setHeaderSuccess();
    this.changeImgSrc('imgMagic', '../../../assets/crown-green.svg');
  }
  //#endregion

  //#region HELPERS
  startMagicTimer(): void {
    this.interval = setInterval(() => {
      this.changeState(MagicStates.Succes);
    }, this.successTimeGoal);
  }

  getRandomIntInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }

  increaseImgSize(id: string): void {
    const element = document.getElementById(id);
    if (element != null && typeof element !== typeof 'undefined') {
      console.log(element);

      const width = element.attributes.getNamedItem('width');
      let currentWidth: number = C_DEFAULT_IMG_WIDTH;
      if (width != null) {
        currentWidth = parseInt(width.value, 10);
        element.attributes.getNamedItem('width').value = (currentWidth + this.widthAddition).toString();
      }

      const height = element.attributes.getNamedItem('height');
      let currentHeight: number = C_DEFAULT_IMG_HEIGHT;
      if (height != null) {
        currentHeight = parseInt(height.value, 10);
        element.attributes.getNamedItem('height').value = (currentHeight + this.heightAddition).toString();
      }
    }
  }

  setHeaderSuccess(): void {
    const elementH1 = document.getElementById('h1Success');
    if (elementH1 != null && typeof elementH1 !== typeof 'undefined') {
      elementH1.innerHTML = 'ti si car';
    }
  }

  disableMagicBtn(): void {
    const elementBtn = document.getElementById('btnMagic') as HTMLInputElement;
    if (elementBtn != null && typeof elementBtn !== typeof 'undefined') {
      elementBtn.disabled = true;
    }
  }

  changeImgSrc(id: string, newSrc: string): void {
    const elementImg = document.getElementById(id) as HTMLInputElement;
    if (elementImg != null && typeof elementImg !== typeof 'undefined') {
      elementImg.src = newSrc;
    }
  }
  //#endregion

}
