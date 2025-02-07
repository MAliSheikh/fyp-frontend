import axios from 'axios';

export const fetchMalls = async (setMalls, setLoading, setError) => {
  try {
    const response = await axios.get('http://localhost:8000/store/mall_options', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.data) {
      throw new Error('No data received from server');
    }

    setMalls(response.data.malls);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching malls:', error);
    setError(error.message);
    setLoading(false);
  }
}; 