
import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';

const prisma = new PrismaClient();

// Define all available data types and their sources
const DATA_TYPES = {
    steps: {
        name: 'com.google.step_count.delta',
        sources: [
            'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
        ]
    },
    calories: {
        name: 'com.google.calories.expended',
        sources: [
            'derived:com.google.calories.expended:com.google.android.gms:from_activities_plus_bmr'
        ]
    },
    heartRate: {
        name: 'com.google.heart_rate.bpm',
        source: 'derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm'
    },
    sleep: {
        name: 'com.google.sleep.segment',
        source: 'derived:com.google.sleep.segment:com.google.android.gms:sleep_segment'
    },
    distance: {
        name: 'com.google.distance.delta',
        sources: [
            'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta'
        ]
    },
    activeMinutes: {
        name: 'com.google.active_minutes',
        sources: [
            'derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes'
        ]
    },
    elevation: {
        name: 'com.google.elevation.delta',
        sources: [
            'derived:com.google.elevation.delta:com.google.android.gms:merge_elevation_delta'
        ]
    },
    floors: {
        name: 'com.google.floors.climbed',
        sources: [
            'derived:com.google.floors.climbed:com.google.android.gms:merge_floors_climbed'
        ]
    },
    weight: {
        name: 'com.google.weight',
        source: 'derived:com.google.weight:com.google.android.gms:merge_weight'
    },
    height: {
        name: 'com.google.height',
        source: 'derived:com.google.height:com.google.android.gms:merge_height'
    },
    bodyFat: {
        name: 'com.google.body.fat.percentage',
        source: 'derived:com.google.body.fat.percentage:com.google.android.gms:merge_body_fat_percentage'
    },
    bodyTemperature: {
        name: 'com.google.body.temperature',
        source: 'derived:com.google.body.temperature:com.google.android.gms:merge_body_temperature'
    },
    bloodPressure: {
        name: 'com.google.blood_pressure',
        source: 'derived:com.google.blood_pressure:com.google.android.gms:merge_blood_pressure'
    },
    bloodOxygen: {
        name: 'com.google.blood_oxygen',
        source: 'derived:com.google.blood_oxygen:com.google.android.gms:merge_blood_oxygen'
    },
    respiratoryRate: {
        name: 'com.google.respiratory_rate',
        source: 'derived:com.google.respiratory_rate:com.google.android.gms:merge_respiratory_rate'
    },
    // Add more specific activity types
    walking: {
        name: 'com.google.activity.segment',
        source: 'derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments'
    },
    running: {
        name: 'com.google.activity.segment',
        source: 'derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments'
    },
    cycling: {
        name: 'com.google.activity.segment',
        source: 'derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments'
    },
    swimming: {
        name: 'com.google.activity.segment',
        source: 'derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments'
    }
};

export async function GET(req) {
    try {
        // Get the most recently updated Google Fit account
        const account = await prisma.googleFitAccount.findFirst({
            orderBy: {
                updatedAt: 'desc'
            }
        });

        console.log('Detailed account info:', {
            id: account?.id,
            providerAccountId: account?.providerAccountId,
            hasAccessToken: !!account?.access_token,
            hasRefreshToken: !!account?.refresh_token,
            tokenType: account?.token_type,
            scope: account?.scope,
            expiresAt: account?.expires_at,
            createdAt: account?.createdAt,
            updatedAt: account?.updatedAt
        });

        if (!account) {
            return new Response(JSON.stringify({ 
                error: 'No Google Fit account found',
                details: 'Please connect your Google Fit account first'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!account.access_token) {
            return new Response(JSON.stringify({ 
                error: 'No valid Google Fit access token found',
                details: 'Please reconnect your Google Fit account'
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Create OAuth2 client with correct credentials
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_FIT_CLIENT_ID,
            process.env.GOOGLE_FIT_CLIENT_SECRET,
            process.env.GOOGLE_FIT_REDIRECT_URI
        );

        // Set credentials with proper scopes
        oauth2Client.setCredentials({
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            scope: account.scope
        });

        // Get user profile information
        const people = google.people({ version: 'v1', auth: oauth2Client });
        const profile = await people.people.get({
            resourceName: 'people/me',
            personFields: 'names,emailAddresses'
        });

        const userEmail = profile.data.emailAddresses?.[0]?.value;
        const userName = profile.data.names?.[0]?.displayName;

        // Create Fitness API client
        const fitness = google.fitness({
            version: 'v1',
            auth: oauth2Client
        });

        // Get date range for last 30 days
        const endTimeMillis = Date.now();
        const startTimeMillis = endTimeMillis - (30 * 24 * 60 * 60 * 1000); // 30 days ago

        console.log('Fetching data for date range:', {
            start: new Date(startTimeMillis).toISOString(),
            end: new Date(endTimeMillis).toISOString()
        });

        // Create requests for all data types with more specific aggregation
        const requests = [];
        
        // Steps data
        requests.push(
            fitness.users.dataset.aggregate({
                userId: 'me',
                requestBody: {
                    aggregateBy: [{
                        dataTypeName: 'com.google.step_count.delta'
                    }],
                    bucketByTime: { durationMillis: 86400000 }, // 24 hours
                    startTimeMillis,
                    endTimeMillis
                }
            })
        );

        // Distance data
        requests.push(
            fitness.users.dataset.aggregate({
                userId: 'me',
                requestBody: {
                    aggregateBy: [{
                        dataTypeName: 'com.google.distance.delta',
                        dataSourceId: 'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta'
                    }],
                    bucketByTime: { durationMillis: 86400000 },
                    startTimeMillis,
                    endTimeMillis
                }
            })
        );

        // Active minutes
        requests.push(
            fitness.users.dataset.aggregate({
                userId: 'me',
                requestBody: {
                    aggregateBy: [{
                        dataTypeName: 'com.google.active_minutes',
                        dataSourceId: 'derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes'
                    }],
                    bucketByTime: { durationMillis: 86400000 },
                    startTimeMillis,
                    endTimeMillis
                }
            })
        );

        // Execute all requests in parallel
        const responses = await Promise.all(requests);
        console.log('Received responses:', responses.length);

        // Log raw data for debugging
        responses.forEach((response, index) => {
            if (response?.data?.bucket) {
                console.log(`Raw data for response ${index}:`, JSON.stringify(response.data, null, 2));
            }
        });

        // Process the responses into daily data
        const dailyData = [];
        const weeklyData = [];
        const activityData = [];
        const bodyData = {};

        // Create a map of all dates in the range
        const dateMap = new Map();
        for (let d = new Date(startTimeMillis); d <= new Date(endTimeMillis); d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            dateMap.set(dateStr, {
                date: dateStr,
                steps: 0,
                calories: 0,
                distance: 0,
                activeMinutes: 0,
                elevation: 0,
                floors: 0,
                activities: {
                    walking: 0,
                    running: 0,
                    cycling: 0,
                    swimming: 0
                }
            });
        }

        // Process steps data with detailed logging
        responses[0]?.data?.bucket?.forEach(bucket => {
            const dateStr = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
            if (dateMap.has(dateStr)) {
                const points = bucket.dataset?.[0]?.point || [];
                console.log(`Raw step data for ${dateStr}:`, {
                    startTime: new Date(parseInt(bucket.startTimeMillis)).toISOString(),
                    endTime: new Date(parseInt(bucket.endTimeMillis)).toISOString(),
                    pointsCount: points.length,
                    rawPoints: points.map(p => ({
                        value: p.value?.[0]?.intVal,
                        startTime: new Date(parseInt(p.startTimeNanos) / 1000000).toISOString(),
                        endTime: new Date(parseInt(p.endTimeNanos) / 1000000).toISOString()
                    }))
                });
                
                // Sum up all step counts for the day
                const totalSteps = points.reduce((sum, point) => {
                    const value = point.value?.[0]?.intVal || 0;
                    return sum + value;
                }, 0);
                
                if (totalSteps > 0) {
                    console.log(`Total steps for ${dateStr}: ${totalSteps}`);
                    const dayData = dateMap.get(dateStr);
                    // Only update if the new total is higher than the existing one
                    if (totalSteps > dayData.steps) {
                    dayData.steps = totalSteps;
                    // Calculate calories based on steps (approximately 0.04 calories per step)
                    dayData.calories = Math.round(totalSteps * 0.04);
                    }
                }
            }
        });

        // Process distance data
        responses[1]?.data?.bucket?.forEach(bucket => {
            const dateStr = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
            if (dateMap.has(dateStr)) {
                const points = bucket.dataset?.[0]?.point || [];
                const totalDistance = points.reduce((sum, point) => {
                    const value = point.value?.[0]?.fpVal || 0;
                    // Convert to kilometers and ensure reasonable value
                    const distanceInKm = value / 1000; // Convert meters to kilometers
                    return sum + (distanceInKm > 100 ? 0 : distanceInKm); // Ignore unrealistic values
                }, 0);
                
                if (totalDistance > 0) {
                    console.log(`Distance for ${dateStr}: ${totalDistance} km`);
                    dateMap.get(dateStr).distance = Number(totalDistance.toFixed(2));
                }
            }
        });

        // Process active minutes data
        responses[2]?.data?.bucket?.forEach(bucket => {
            const dateStr = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
            if (dateMap.has(dateStr)) {
                const points = bucket.dataset?.[0]?.point || [];
                const totalMinutes = points.reduce((sum, point) => sum + (point.value?.[0]?.intVal || 0), 0);
                if (totalMinutes > 0) {
                    console.log(`Active minutes for ${dateStr}: ${totalMinutes}`);
                    dateMap.get(dateStr).activeMinutes = totalMinutes;
                }
            }
        });

        // Convert map to array and sort by date
        dailyData.push(...Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date)));

        // Calculate weekly data
        const weeks = new Map();
        dailyData.forEach(day => {
            const date = new Date(day.date);
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
            const weekKey = weekStart.toISOString().split('T')[0];

            if (!weeks.has(weekKey)) {
                weeks.set(weekKey, {
                    startDate: weekKey,
                    endDate: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    steps: 0,
                    calories: 0,
                    distance: 0,
                    activeMinutes: 0,
                    elevation: 0,
                    floors: 0,
                    activities: {
                        walking: 0,
                        running: 0,
                        cycling: 0,
                        swimming: 0
                    },
                    days: 0
                });
            }

            const week = weeks.get(weekKey);
            week.steps += day.steps;
            week.calories += day.calories;
            week.distance += day.distance;
            week.activeMinutes += day.activeMinutes;
            week.elevation += day.elevation;
            week.floors += day.floors;
            week.activities.walking += day.activities.walking;
            week.activities.running += day.activities.running;
            week.activities.cycling += day.activities.cycling;
            week.activities.swimming += day.activities.swimming;
            week.days += 1;
        });

        // Convert weeks to array and calculate averages
        weeklyData.push(...Array.from(weeks.values()).map(week => ({
            ...week,
            avgSteps: Math.round(week.steps / week.days),
            avgCalories: Math.round(week.calories / week.days),
            avgDistance: Number((week.distance / week.days).toFixed(2)),
            avgActiveMinutes: Math.round(week.activeMinutes / week.days),
            avgElevation: Number((week.elevation / week.days).toFixed(1)),
            avgFloors: Math.round(week.floors / week.days),
            avgActivities: {
                walking: Math.round(week.activities.walking / week.days),
                running: Math.round(week.activities.running / week.days),
                cycling: Math.round(week.activities.cycling / week.days),
                swimming: Math.round(week.activities.swimming / week.days)
            }
        })));

        // Calculate totals and averages
        const totals = {
            steps: dailyData.reduce((sum, day) => sum + day.steps, 0),
            calories: dailyData.reduce((sum, day) => sum + day.calories, 0),
            distance: Number(dailyData.reduce((sum, day) => sum + day.distance, 0).toFixed(2)),
            activeMinutes: dailyData.reduce((sum, day) => sum + day.activeMinutes, 0),
            elevation: Number(dailyData.reduce((sum, day) => sum + day.elevation, 0).toFixed(1)),
            floors: dailyData.reduce((sum, day) => sum + day.floors, 0),
            activities: {
                walking: dailyData.reduce((sum, day) => sum + day.activities.walking, 0),
                running: dailyData.reduce((sum, day) => sum + day.activities.running, 0),
                cycling: dailyData.reduce((sum, day) => sum + day.activities.cycling, 0),
                swimming: dailyData.reduce((sum, day) => sum + day.activities.swimming, 0)
            }
        };

        const averages = {
            steps: Math.round(totals.steps / dailyData.length),
            calories: Math.round(totals.calories / dailyData.length),
            distance: Number((totals.distance / dailyData.length).toFixed(2)),
            activeMinutes: Math.round(totals.activeMinutes / dailyData.length),
            elevation: Number((totals.elevation / dailyData.length).toFixed(1)),
            floors: Math.round(totals.floors / dailyData.length),
            activities: {
                walking: Math.round(totals.activities.walking / dailyData.length),
                running: Math.round(totals.activities.running / dailyData.length),
                cycling: Math.round(totals.activities.cycling / dailyData.length),
                swimming: Math.round(totals.activities.swimming / dailyData.length)
            }
        };

        return new Response(JSON.stringify({
            account: {
                id: account.id,
                providerAccountId: account.providerAccountId,
                email: userEmail,
                name: userName,
                connectedAt: account.createdAt,
                lastUpdated: account.updatedAt,
                scope: account.scope
            },
            dailyData,
            weeklyData,
            activityData,
            bodyData,
            totals,
            averages,
            availableMetrics: Object.keys(DATA_TYPES)
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching Google Fit data:', error);
        return new Response(JSON.stringify({ 
            error: 'Internal server error',
            details: error.message || 'Failed to fetch Google Fit data'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        await prisma.$disconnect();
    }
} 
