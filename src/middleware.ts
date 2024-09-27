import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'


const LOGIN_ROUTE = '/?page=user';

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
    const token = req.cookies.get('access_token');

    if (!token) {
        return NextResponse.redirect(new URL(LOGIN_ROUTE, req.url));
    }

    try {
        const url = new URL('/user/verify', process.env.BACKEND);
        await fetch(url, {
            credentials: 'include',
            headers: {
                'Cookie': token.name + '=' + token.value
            }
        });
        return NextResponse.next();
    } catch (error) {
        console.log(error)
        return NextResponse.redirect(new URL(LOGIN_ROUTE, req.url));
    }
}

export const config = {
    matcher: ['/home', '/settings'],
}