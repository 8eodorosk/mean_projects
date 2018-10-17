 import { AbstractControl } from '@angular/forms';
 import { Observable, Observer, of } from 'rxjs';


//asyncronous  validators returna a promise or a  observable
//the promise will return a property which can be interpreted as a string and i dont care about the name and the value any
// this is a key: value return type of a "string i dont care" : "of any value"
// if validation passed it will return null, if not it will return an object 
export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}>  => {
	if (typeof(control.value) === 'string') {
		return of(null);
	}
	const file = control.value as File;
	const fileReader = new FileReader();
	const frObs = Observable.create((observer: Observer<{[key: string]: any}>) => {
		fileReader.addEventListener("loadend", ()=>{
			const arr = new Uint8Array(fileReader.result).subarray(0,4);
			let header = "";
			let isValid = false;
			for(let i =0; i<arr.length; i++){
				header +=arr[i].toString(16); //convrt this header hexadecimal string
			}
			switch (header) {
				case "89504e47":
					isValid = true;
					break;
				case "ffd8ffe0":
				case "ffd8ffe1":
				case "ffd8ffe2":
				case "ffd8ffe3":
				case "ffd8ffe8":
					isValid = true;
					break;
				default:
					isValid = false; // Or you can use the blob.type as fallback
					break;
        	}
        	if (isValid) {
        		observer.next(null);
        	} else {
        		observer.next({invalidMimeType: true});
        	}
        	observer.complete();
		});
		fileReader.readAsArrayBuffer(file);
	});
	return frObs;
};