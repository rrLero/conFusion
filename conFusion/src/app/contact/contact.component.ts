import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Feedback, ContactType } from "../shared/feedback";
import {flyInOut, visibility, hide, expand} from "../animations/app.animation";
import { FeedbackService} from "../services/feedback.service";
import {visitSiblingRenderNodes} from "@angular/core/src/view/util";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    hide(),
    expand()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  visibilityForm = 'shown';
  visibilitySpinner = 'hidden';
  contactType = ContactType;
  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required': 'first name is required.',
      'minlength': 'first name must be at least 2 chs long',
      'maxlength': 'first name can not be more 25 chs long'
    },
    'lastname': {
      'required': 'last name is required.',
      'minlength': 'last name must be at least 2 chs long',
      'maxlength': 'last name  can not be more 25 chs long'
    },
    'telnum': {
      'required': 'tel num is required.',
      'pattern': 'Tel. number must contain only numbers',
    },
    'email': {
      'required': 'email is required.',
      'email': 'Email must be email-type',
    },
  };

  constructor(private fb: FormBuilder, private feedBackService: FeedbackService) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages

  };

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit() {
    this.visibilityForm = 'hidden';
    this.visibilitySpinner = 'shown';
    this.feedBackService.submitFeedback(this.feedbackForm.value)
      .subscribe(feedback => {
        this.visibilitySpinner = 'hidden';
        this.feedback = feedback;
        setTimeout(func=>{
          this.feedback = null;
          this.visibilityForm = 'shown';
          }, 5000);

      });
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
  }

}
