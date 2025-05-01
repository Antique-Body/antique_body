// API response utilities

// Generate a successful response
export const successResponse = (data, message = "Success", statusCode = 200) => {
    return {
        status: statusCode,
        body: {
            success: true,
            message,
            data,
        },
    };
};

// Generate an error response
export const errorResponse = (message, details = null, statusCode = 400) => {
    return {
        status: statusCode,
        body: {
            success: false,
            error: message,
            ...(details && { details }),
        },
    };
};

// Parse request query parameters
export const parseQueryParams = (request) => {
    const url = new URL(request.url);
    const params = {};

    for (const [key, value] of url.searchParams.entries()) {
        params[key] = value;
    }

    return params;
};

// Format validation errors for client consumption
export const formatValidationErrors = (errors) => {
    return Object.entries(errors).reduce((acc, [field, message]) => {
        return {
            ...acc,
            [field]: message,
        };
    }, {});
};
