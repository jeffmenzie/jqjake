// export const apiUrlPrefix = process.env.NODE_ENV === "development" ? "http://192.168.50.205:3005/api/" : "/api/";
export const apiUrlPrefix = process.env.NODE_ENV === "development" ? "http://localhost:3005/api/" : "/api/";
export const domainPrefix = process.env.NODE_ENV === "development" ? apiUrlPrefix : window.location.origin;
