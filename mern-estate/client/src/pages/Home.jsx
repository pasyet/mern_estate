import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
    const [offerListings, setOfferListings] = useState([]);
    const [saleListings, setSaleListings] = useState([]);
    const [rentListings, setRentListings] = useState([]);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                // Fetch offer listings
                const offerRes = await fetch('/api/listing/get?offer=true&limit=4');
                const offerData = await offerRes.json();
                setOfferListings(offerData);

                // Fetch rent listings
                const rentRes = await fetch('/api/listing/get?type=rent&limit=4');
                const rentData = await rentRes.json();
                setRentListings(rentData);

                // Fetch sale listings
                const saleRes = await fetch('/api/listing/get?type=sale&limit=4');
                const saleData = await saleRes.json();
                setSaleListings(saleData);
            } catch (error) {
                console.log('Error fetching listings:', error);
            }
        };

        fetchListings();
    }, []);

    return (
        <div>
            {/* Top Section */}
            <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
                <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
                    Find your next <span className="text-slate-500">perfect</span>
                    <br />
                    place with ease
                </h1>
                <div className="text-gray-400 text-xs sm:text-sm">
                    Sahand Estate is the best place to find your next perfect place to live.
                    <br />
                    We have a wide range of properties for you to choose from.
                </div>
                <Link
                    to="/search"
                    className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
                >
                    Let's get started...
                </Link>
            </div>

            {/* Swiper Section */}
            {offerListings && offerListings.length > 0 && (
                <Swiper navigation modules={[Navigation]}>
                    {offerListings.map((listing) => (
                        <SwiperSlide key={listing._id}>
                            <div
                                style={{
                                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                                    backgroundSize: 'cover',
                                }}
                                className="h-[500px]"
                            ></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            {/* Listing Results Section */}
            <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
                {/* Offers Section */}
                {offerListings && offerListings.length > 0 && (
                    <div>
                        <div className="my-3">
                            <h2 className="text-2xl font-semibold text-slate-600">
                                Recent offers
                            </h2>
                            <Link
                                className="text-sm text-blue-800 hover:underline"
                                to="/search?offer=true"
                            >
                                Show more offers
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {offerListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Rent Section */}
                {rentListings && rentListings.length > 0 && (
                    <div>
                        <div className="my-3">
                            <h2 className="text-2xl font-semibold text-slate-600">
                                Recent places for rent
                            </h2>
                            <Link
                                className="text-sm text-blue-800 hover:underline"
                                to="/search?type=rent"
                            >
                                Show more places for rent
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {rentListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Sale Section */}
                {saleListings && saleListings.length > 0 && (
                    <div>
                        <div className="my-3">
                            <h2 className="text-2xl font-semibold text-slate-600">
                                Recent places for sale
                            </h2>
                            <Link
                                className="text-sm text-blue-800 hover:underline"
                                to="/search?type=sale"
                            >
                                Show more places for sale
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {saleListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
