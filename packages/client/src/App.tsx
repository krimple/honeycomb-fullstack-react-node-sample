import {useState, useCallback} from 'react';

function App() {
    const [message, setMessage] = useState('');

    const callFetch = async() => {
        const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/random-message`);
        const data = await response.json();
        return data;
    }
    const fetchOnce= useCallback(() => {
        setMessage('');
        callFetch()
            .then((response) => {
                setMessage(response.message);
            })
    }, []);

    const fetchTwice= useCallback(() => {
        setMessage('');
        callFetch()
            .then((response) => {
                setMessage(response.message);
            })
            .then(() => callFetch())
            .then((response) => {
                setMessage(response.message);
            });
    }, []);

    const clickWithInlines= useCallback(() => {
        setMessage('');
        fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/random-message`)
            .then((response) => response.json())
            .then((data) => {
                setMessage(data.message)
            })
            .then(() => fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/random-message`))
            .then((response) => response.json())
            .then((data) => setMessage(data.message))
            .catch(e => {
                console.dir(e);
                alert(`Error : ${e.message}`);
            })
    }, []);

    return (
        <div>
            <div data-testid='message' className="mx-auto my-auto h-auto overflow-visible text-4xl w-2/3 p-8 b-2 bg-amber-100 border-2">
                { message }
            </div>
            <div className="mx-auto w-2/3 h-[20%] py-2 align-middle">
                <span className="text-3xl bold">Press that button...</span>
                <button className="border border-black rounded-2xl p-1" name="clickOnce" onClick={fetchOnce}>Do it
                    once!
                </button>
                <button className="border border-black rounded-2xl p-1" name="clickTwice" onClick={fetchTwice}>Do it
                    twice!
                </button>
                <button className="border border-black rounded-2xl p-1" name="clickWithInlines" onClick={clickWithInlines}>Do it
                    all in one event
                </button>
                Mode is: { import.meta.env.MODE }
            </div>
        </div>
    );
}

export default App;
