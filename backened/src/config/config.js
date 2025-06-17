

export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    sameSite: 'Lax',
    maxAge: 1000 * 60 * 60,
}