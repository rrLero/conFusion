import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from "@angular/material";




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user = {username:'', password: '', remember:false};
  constructor(private dialogref: MdDialogRef<LoginComponent>) { }

  ngOnInit() {
  }
  onSubmit() {
    console.log("user: ", this.user);
    this.dialogref.close();
  }
}
