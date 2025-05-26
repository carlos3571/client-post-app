import { Routes } from "@angular/router";
import { FrontLayoutsComponent } from "./layouts/front-layouts/front-layouts.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";

const frontRoutes: Routes = [
    {
        path:'',
        component:FrontLayoutsComponent,
        children:[
            {
                path:'',
                component: HomePageComponent
            },
            {
                path:'**',
                loadComponent:()=>import('./pages/not-found-page/not-found-page.component')
            }
        ]
    }
]

export default frontRoutes;