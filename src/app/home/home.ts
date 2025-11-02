import { Component, ChangeDetectionStrategy } from "@angular/core";  
import { Hero } from "../hero/hero";  
import { About } from "../about/about";  
import { Cards } from "../cards/cards";  
  
@Component({  
    selector:'app-home',  
    standalone: true,  
    imports: [Hero, About, Cards],  
    templateUrl: './home.html',  
    styleUrls:['./home.scss'],  
    changeDetection: ChangeDetectionStrategy.OnPush  
})  
  
export class Home{}