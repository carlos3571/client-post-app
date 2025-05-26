import { Pipe, PipeTransform } from "@angular/core";
import { environment } from "../../../environments/environment.development";

const baseUrl = environment.apiUrl;
@Pipe({
    name: 'userImage',
})

export class UserImagePipe implements PipeTransform{
    transform(value: string):string {
        if(value === 'new'){
            return './assets/images/avatar/avatar-user.png';
        }
        return `${baseUrl}/users/avatar/${value }`
        
    }
}