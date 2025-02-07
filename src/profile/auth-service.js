// Basic authentication service
export const authService = {
    logout: () => {
        // Clear any authentication tokens/data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Add any other cleanup needed
    }
}; 