import { Component, OnInit, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { trigger, state, style, animate, transition } from "@angular/animations";

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', []),
    state('shown', style({
      transform: 'scale(1.0)',
      opacity: 0
    })),
    state('hidden', style({
      transform: 'scale(0.5)',
      opacity: 0
    })),
    transition('* => *', animate('0.5s ease-in-out'))
  ]
})
export class DishdetailComponent implements OnInit {

  dishdetailForm: FormGroup;
  comment: Comment;
  dish: Dish;
  dishcopy = null;
  dishIds: number[];
  prev: number;
  next: number;
  errMess: string;
  visibility = 'shown';

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required': 'first author is required.',
      'minlength': 'first author must be at least 2 chs long',
      'maxlength': 'first author can not be more 25 chs long'
    },
    'comment': {
      'required': 'first author is required.',
      'minlength': 'first author must be at least 2 chs long'
    }
  };

  constructor(private dishservice: DishService,
              private location: Location,
              private route: ActivatedRoute, private fb: FormBuilder,
              @Inject('BaseURL') private BaseURL) {
    this.createForm();
  }

  ngOnInit() {
    this.dishservice.getDishIds()
      .subscribe(dishIds => this.dishIds = dishIds);

    this.route.params
      .switchMap((params: Params) => {this.visibility = 'hidden'; return this.dishservice.getDish(+params['id'])})
      .subscribe(dish => {
        this.dish = dish;
        this.dishcopy = dish;
        this.setPrevNext(dish.id);
        this.visibility = 'shown';
      }, errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.dishdetailForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      comment: ['', [Validators.required, Validators.minLength(2)]],
      rating: ['5'],
      date: ['']
    });
    this.dishdetailForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.dishdetailForm) {
      return;
    }
    const form = this.dishdetailForm;

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
    this.comment = this.dishdetailForm.value;
    this.comment.date = (new Date()).toString();
    this.dishcopy.comments.push(this.comment);
    this.dishcopy.save()
      .subscribe(dish => this.dish = dish);
    this.dishdetailForm.reset({
      author: '',
      comment: '',
      rating: '5'
    });
  }
}
