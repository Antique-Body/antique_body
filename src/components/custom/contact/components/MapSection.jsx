import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

export const MapSection = () => {
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);

    useEffect(() => {
        // Initialize the map
        const initMap = async () => {
            // In a real application, this API key should be stored securely in environment variables
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE",
                version: "weekly",
            });

            const google = await loader.load();

            // Athens, Greece coordinates
            const athensLocation = { lat: 37.9838, lng: 23.7275 };

            const map = new google.maps.Map(mapContainerRef.current, {
                center: athensLocation,
                zoom: 14,
                styles: [
                    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                    {
                        featureType: "administrative.locality",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#d59563" }],
                    },
                    {
                        featureType: "poi",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#d59563" }],
                    },
                    {
                        featureType: "poi.park",
                        elementType: "geometry",
                        stylers: [{ color: "#263c3f" }],
                    },
                    {
                        featureType: "poi.park",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#6b9a76" }],
                    },
                    {
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [{ color: "#38414e" }],
                    },
                    {
                        featureType: "road",
                        elementType: "geometry.stroke",
                        stylers: [{ color: "#212a37" }],
                    },
                    {
                        featureType: "road",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#9ca5b3" }],
                    },
                    {
                        featureType: "road.highway",
                        elementType: "geometry",
                        stylers: [{ color: "#746855" }],
                    },
                    {
                        featureType: "road.highway",
                        elementType: "geometry.stroke",
                        stylers: [{ color: "#1f2835" }],
                    },
                    {
                        featureType: "road.highway",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#f3d19c" }],
                    },
                    {
                        featureType: "transit",
                        elementType: "geometry",
                        stylers: [{ color: "#2f3948" }],
                    },
                    {
                        featureType: "transit.station",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#d59563" }],
                    },
                    {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{ color: "#17263c" }],
                    },
                    {
                        featureType: "water",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#515c6d" }],
                    },
                    {
                        featureType: "water",
                        elementType: "labels.text.stroke",
                        stylers: [{ color: "#17263c" }],
                    },
                ],
            });

            // Add a marker for the Athens location

            // Save the map instance in a ref for later use
            mapRef.current = map;
        };

        // Initialize the map when the component mounts
        initMap().catch(console.error);

        // Clean up
        return () => {
            // Cleanup if needed
        };
    }, []);

    return (
        <section className="py-12 relative bg-gradient-to-b from-black to-[#0A0A0A]">
            <div className="container mx-auto px-4 relative z-10">
                <div className="rounded-xl overflow-hidden border border-gray-800 h-[400px] relative">
                    {/* Map Container */}
                    <div ref={mapContainerRef} className="absolute inset-0 w-full h-full"></div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10 pointer-events-none"></div>

                    {/* Info Card */}
                    <div className="absolute bottom-6 left-6 z-20 bg-black/80 backdrop-blur-md p-4 rounded-lg border border-gray-800">
                        <h3 className="text-xl font-bold mb-1 text-[#FF6B00]">Athens Headquarters</h3>
                        <p className="text-white">123 Fitness Avenue, Athens, Greece</p>
                        <a
                            href="https://maps.google.com/?q=Athens,Greece"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center text-sm text-[#FF6B00] hover:text-white transition-colors"
                        >
                            Get Directions
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4 ml-1"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
