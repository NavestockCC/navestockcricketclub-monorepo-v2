import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FormsModule } from '@angular/forms';
import { Observable, debounceTime, interval, map, switchMap, tap } from 'rxjs';

import {
  Database,
  DatabaseReference,
  objectVal,
  ref,
  set,
} from '@angular/fire/database';

import { Scoreboard } from '@navestockcricketclub-monorepo-v2/interfaces-scoreboard';

@Component({
  selector: 'ncc-app-scoreboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatProgressBarModule,
    FormsModule,
  ],
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
})
export class ScoreboardComponent implements OnInit {
  public scoreboardForm = new FormGroup({
    top: new FormGroup({
      batsman1: new FormControl(''),
      batsman2: new FormControl(''),
      teamscore: new FormControl(''),
    }),
    bottom: new FormGroup({
      overs: new FormControl(''),
      wickets: new FormControl(''),
      target: new FormControl(''),
    }),
  });

  private updateValComp: Scoreboard | null = null;  //variable to prevent double update of the RTDB
  private doc: DatabaseReference = ref(this.rtdb, 'scoreboardlive');
  public scoreboardObjectValue$: Observable<Scoreboard> = objectVal(
    this.doc
  ).pipe(map((resp) => resp as Scoreboard));

  private scoreboardFormObservable: Observable<Scoreboard> =
    this.scoreboardForm.valueChanges.pipe(
      map((resp) => resp as Scoreboard),
      debounceTime(5000),
      tap((resp) => {
        this.updateRTDB(resp);
      })
    );

  public rtdbUpdateProgress: Observable<number> =
    this.scoreboardForm.valueChanges.pipe(
      switchMap((resp) => interval(1000)),
      map(resp => 100 - (resp * 20))
    );

  constructor(private rtdb: Database) {}

  ngOnInit(): void {
    this.scoreboardFromRTDBSync();
    this.scoreboardFormObservable.subscribe();
  }


  addRuns(valueToAdd: number, toWhom: string) {
    let batVal = 0;

    let controlref: FormControl;

    if (toWhom == 'batsman1') {
      controlref = this.scoreboardForm.controls.top.controls.batsman1;
    } else if (toWhom == 'batsman2') {
      controlref = this.scoreboardForm.controls.top.controls.batsman2;
    } else {
      controlref = this.scoreboardForm.controls.top.controls.batsman1;
    }

    if (controlref.value != null) {
      batVal = +controlref.value;
    }

    batVal = batVal + valueToAdd;
    this.addTeamScore(valueToAdd);
    controlref.setValue(batVal.toString());
  }

  addTeamScore(valueToAdd: number) {
    let teamVal = 0;
    if (this.scoreboardForm.controls.top.controls.teamscore.value != null) {
      teamVal = +this.scoreboardForm.controls.top.controls.teamscore.value;
    }

    teamVal = teamVal + valueToAdd;
    this.scoreboardForm.controls.top.controls.teamscore.setValue(
      teamVal.toString()
    );
  }

  addOversWickets(valueToAdd: number, toWhom: string) {
    let nVal = 0;

    let controlref: FormControl;

    if (toWhom == 'overs') {
      controlref = this.scoreboardForm.controls.bottom.controls.overs;
    } else if (toWhom == 'wickets') {
      controlref = this.scoreboardForm.controls.bottom.controls.wickets;
    } else {
      controlref = this.scoreboardForm.controls.top.controls.teamscore;
    }

    if (controlref.value != null) {
      nVal = +controlref.value;
    }

    nVal = nVal + valueToAdd;
    controlref.setValue(nVal.toString());
  }

  setTarget() {
    let nVal = 0;

    const controlref: FormControl =
      this.scoreboardForm.controls.top.controls.teamscore;
    if (controlref) {
      nVal = +controlref.value + 1;
    }

    this.scoreboardForm.controls.bottom.controls.target.setValue(
      nVal.toString()
    );
  }

  private scoreboardFromRTDBSync() {
    this.scoreboardObjectValue$
      .pipe(
        map((resp) => resp as any),
        tap((resp) => this.scoreboardForm.setValue(resp))
      )
      .subscribe();
  }

  zeroScoreboardFrom() {
    const zeroVal: Scoreboard = {
      top: {
        batsman1: 0,
        batsman2: 0,
        teamscore: 0,
      },
      bottom: {
        wickets: 0,
        overs: 0,
        target: 0,
      },
    };

    this.updateRTDB(zeroVal);
  }

  private updateRTDB(updateVal: Scoreboard) {
    if (JSON.stringify(this.updateValComp) != JSON.stringify(updateVal)) {
      this.updateValComp = updateVal;
      set(this.doc, updateVal)
        .then(() => console.log('RTDB Set() completed'))
        .catch((err) => console.log(err));
    }
  }
}
