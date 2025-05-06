'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function NotFound() {
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user) {
            if (!session.user.role) {
                // If user has account but no role, redirect to select-role
                router.replace('/select-role');
            } else {
                const role = session.user.role.toLowerCase();
                if (role === 'trainer') {
                    router.replace('/trainer/dashboard');
                } else if (role === 'client') {
                    router.replace('/client/dashboard');
                } else if (role === 'user') {
                    const hasPreferences = session.user.hasCompletedTrainingSetup;
                    router.replace(hasPreferences ? '/user/dashboard' : '/user/training-setup');
                }
            }
        } else {
            router.replace('/auth/login');
        }
    }, [session, router]);

    return null;
} 