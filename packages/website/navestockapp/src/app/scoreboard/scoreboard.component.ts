import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import {FormsModule} from '@angular/forms';
import { Observable } from 'rxjs';

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
    FormsModule
  ],
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
})
export class ScoreboardComponent {


  scoreboardForm = new FormGroup({
    top: new FormGroup({
      batsman1: new FormControl(''),
      batsman2: new FormControl(''),
      teamscore: new FormControl('')
    }),
    bottom: new FormGroup({
      overs: new FormControl(''),
      wickets: new FormControl(''),
      target: new FormControl('')
    })
  })

  scbv: Observable<any> = this.scoreboardForm.valueChanges
  
  addRuns(valueToAdd:number, toWhom:string){
      let batVal = 0;
     
      let controlref:FormControl;

      if(toWhom == "batsman1"){
        controlref = this.scoreboardForm.controls.top.controls.batsman1;
      } else if(toWhom == "batsman2"){
        controlref = this.scoreboardForm.controls.top.controls.batsman2;
      } else {
        controlref = this.scoreboardForm.controls.top.controls.batsman1;
      }

      if(controlref.value != null){
        batVal = +controlref.value;
      }

      batVal = batVal + valueToAdd;
      this.addTeamScore(valueToAdd);
      controlref.setValue(batVal.toString());

  }

  addTeamScore(valueToAdd:number){
    let teamVal = 0;
    if(this.scoreboardForm.controls.top.controls.teamscore.value != null){
      teamVal = +this.scoreboardForm.controls.top.controls.teamscore.value;
    }

    teamVal= teamVal + valueToAdd;
    this.scoreboardForm.controls.top.controls.teamscore.setValue(teamVal.toString())
  }

}
