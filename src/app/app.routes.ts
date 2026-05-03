import { Routes } from '@angular/router';
import { authGuard } from './Core/Guards/auth-guard';
import { isLoggedGuard } from './Core/Guards/is-logged-guard';

export const routes: Routes = [

    {
        path: "",
        loadComponent: () =>
            import('./Layouts/auth-layout/auth-layout').then(m => m.AuthLayout),
        canActivate: [isLoggedGuard],
        children: [
            { path: "", redirectTo: "login", pathMatch: "full" },

            {
                path: "login",
                loadComponent: () =>
                    import('./Components/login/login').then(m => m.Login)
            },
            {
                path: "register",
                loadComponent: () =>
                    import('./Components/register/register').then(m => m.Register)
            },
            {
                path: "forgetpassword",
                loadComponent: () =>
                    import('./Components/forget-password/forget-password').then(m => m.ForgetPassword)
            },
        ],
    },

    {
        path: "",
        loadComponent: () =>
            import('./Layouts/blank-layout/blank-layout').then(m => m.BlankLayout),
        canActivate: [authGuard],
        children: [

            {
                path: "home",
                loadComponent: () =>
                    import('./Components/home/home').then(m => m.Home)
            },

            {
                path: "products",
                loadComponent: () =>
                    import('./Components/product/product').then(m => m.Product)
            },

            {
                path: "categories",
                loadComponent: () =>
                    import('./Components/category/category').then(m => m.Category)
            },

            {
                path: "cart",
                loadComponent: () =>
                    import('./Components/cart/cart').then(m => m.Cart)
            },

            {
                path: "brands",
                loadComponent: () =>
                    import('./Components/brand/brand').then(m => m.Brand)
            },

            {
                path: "details/:id",
                loadComponent: () =>
                    import('./Components/details/details').then(m => m.Details)
            },

            {
                path: "orders/:id",
                loadComponent: () =>
                    import('./Components/place-order/place-order').then(m => m.PlaceOrder)
            },

            {
                path: "allorders",
                loadComponent: () =>
                    import('./Components/all-orders/all-orders').then(m => m.AllOrders)
            },

        ],
    },

    {
        path: "**",
        loadComponent: () =>
            import('./Components/not-found/not-found').then(m => m.NotFound)
    },
];