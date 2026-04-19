import { Routes } from '@angular/router';
import { AuthLayout } from './Layouts/auth-layout/auth-layout';
import { BlankLayout } from './Layouts/blank-layout/blank-layout';

import { Login } from './Components/login/login';
import { Register } from './Components/register/register';
import { Home } from './Components/home/home';
import { Product } from './Components/product/product';
import { Category } from './Components/category/category';
import { Cart } from './Components/cart/cart';
import { Brand } from './Components/brand/brand';
import { NotFound } from './Components/not-found/not-found';

import { authGuard } from './Core/Guards/auth-guard';
import { isLoggedGuard } from './Core/Guards/is-logged-guard';

export const routes: Routes = [
    {
        path: "",
        component: AuthLayout,
        canActivate: [isLoggedGuard],
        children: [
            { path: "", redirectTo: "login", pathMatch: "full" },
            { path: "login", component: Login },
            { path: "register", component: Register },
        ],
    },
    {
        path: "",
        component: BlankLayout,
        canActivate: [authGuard],
        children: [
            { path: "home", component: Home },
            { path: "products", component: Product },
            { path: "categories", component: Category },
            { path: "cart", component: Cart },
            { path: "brands", component: Brand },
        ],
    },
    { path: "**", component: NotFound },
];