import { useEffect, useState } from 'react';
import { useImmerReducer } from 'use-immer';
import { TypingContext, TypingStateActionType, initialState, typingReducer } from './store'
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Speed from './components/Speed';
import { DictChapterButton } from './components/DictChapterButton';
import WordPanel from './components/WordPanel';



const Explore: React.FC = () => {
    const [state, dispatch] = useImmerReducer(typingReducer, structuredClone(initialState))
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 2000)
    }, [])

    return (<TypingContext.Provider value={{ state: state, dispatch }}>
        <Layout>
            <Header>
                <DictChapterButton />
            </Header>
            <div className="container mx-auto flex h-full flex-1 flex-col items-center justify-center pb-5">
                <div className="container relative mx-auto flex h-full flex-col items-center">
                    <div className="container flex flex-grow items-center justify-center">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center ">
                                <div
                                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid  border-indigo-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status"
                                ></div>
                            </div>
                        ) : (
                            !state.isFinished && <WordPanel />
                            // <>Explore Page</>
                        )}
                    </div>
                    <Speed />
                </div>
            </div>
        </Layout>
    </TypingContext.Provider>)

}

export default Explore;