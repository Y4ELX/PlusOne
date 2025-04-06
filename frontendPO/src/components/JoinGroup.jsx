import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function JoinGroup() {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const joinGroup = async () => {
            try {
                const response = await fetch(`http://localhost:5000/join/${token}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                const data = await response.json();

                if (data.success) {
                    alert(data.message);
                    navigate('/home');
                } else {
                    alert(data.message);
                    navigate('/login', { state: { from: `/join/${token}` } });
                }
            } catch (error) {
                console.error('Error al unirse al grupo:', error);
            }
        };

        joinGroup();
    }, [token, navigate]);

    return <p>Procesando...</p>;
}

export default JoinGroup;