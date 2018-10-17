import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";


import { Post } from '../post.model';
import { PostsService } from  '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
	selector: 'app-post-create',
	templateUrl: './post-create.component.html',
	styleUrls:['./post-create.component.css']

})
export class PostCreateComponent implements OnInit{
	enteredContent = '';
	enteredTitle = '';
	private mode = 'create'; 
	private postId: string;
	post: Post; 
	imagePreview: any;
	isLoading = false;
	form: FormGroup; 


	constructor(public postsService:PostsService, public route: ActivatedRoute){}

	ngOnInit(){ 

		this.form = new FormGroup({
			title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
			content: new FormControl(null, { validators: [Validators.required]}),
			image: new FormControl(null, { 
				validators: [Validators.required],
				asyncValidators: [mimeType]
			})
		});

		// console.log("1", this.form);

		this.route.paramMap.subscribe((paramMap: ParamMap)=>{ //this is an observable we dont need to unsubscribe
			if (paramMap.has('postId')) {
				this.mode = 'edit';
				this.postId = paramMap.get('postId');
				this.isLoading = true;
				this.postsService.getPost(this.postId).subscribe(postData => {
					//console.log(postData);
					this.isLoading = false;
					this.post = {
						id: postData._id,
						title: postData.title,
						content: postData.content,
						imagePath: postData.imagePath
					};
					this.form.setValue({
						title: this.post.title,
						content: this.post.content,
						image: this.post.imagePath
					});	
				});
			} else{
				this.mode = 'create';
				this.postId  = null;
			}
		}); 

		// console.log("2", this.form);

	}

	onImagePicked(event: Event){
		const file= (event.target as HTMLInputElement).files[0]; // this is type conversion, telling typescript that event.target is an ipunt element
		this.form.patchValue({image: file});
		this.form.get('image').updateValueAndValidity(); 
		const reader = new FileReader();
		reader.onload = () => { 
			this.imagePreview = reader.result; //so far no error when compiling..
		};
		reader.readAsDataURL(file); 
	}
 
	onSavePost(){
		if (this.form.invalid) {
			// console.log("ddsdfsdfsdfsdfsdfsdfsdf");
			return;
		}

		this.isLoading = true;
		if (this.mode === 'create') {
			console.log(this.form.value.title, this.form.value.content);
			this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
		} else {

			this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
		}

		
		this.form.reset();
		
	}
}


