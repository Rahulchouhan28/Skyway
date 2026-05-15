module.exports = (req, res) => {
    res.status(200).json({
        SKYSCANNER_API_KEY: process.env.SKYSCANNER_API_KEY ?? '',
        AMADEUS_API_KEY: process.env.AMADEUS_API_KEY ?? '',
        AMADEUS_API_SECRET: process.env.AMADEUS_API_SECRET ?? '',
        AVIATIONSTACK_API_KEY: process.env.AVIATIONSTACK_API_KEY ?? '',
        SKYSCANNER_API_URL: process.env.SKYSCANNER_API_URL ?? '',
        AMADEUS_API_URL: process.env.AMADEUS_API_URL ?? '',
        AVIATIONSTACK_API_URL: process.env.AVIATIONSTACK_API_URL ?? '',
        DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY ?? 'INR',
        DEFAULT_MARKET: process.env.DEFAULT_MARKET ?? 'IN',
        DEFAULT_LOCALE: process.env.DEFAULT_LOCALE ?? 'en-IN',
        MAX_RESULTS: parseInt(process.env.MAX_RESULTS ?? '50', 10),
    });
};
