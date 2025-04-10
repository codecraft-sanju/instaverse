import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { PostProvider } from './context/PostContext.jsx';
import { FollowProvider } from './context/followContext.jsx';
import { Provider } from 'react-redux'; 
import store from './redux/store'; 
import { CommentProvider } from './context/commentContext.jsx';
import { StoryProvider } from './context/StoryContext.jsx';
//import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <UserProvider>
        <PostProvider>
          <FollowProvider>
            <CommentProvider>
              <StoryProvider>
                  <App />
              </StoryProvider>
            
            </CommentProvider>

            {/* <Toaster position="top-right" reverseOrder={false} /> */}
          </FollowProvider>
        </PostProvider>
      </UserProvider>
    </Provider>
  </StrictMode>,
);
