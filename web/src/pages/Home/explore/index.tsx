import { useCallback, useEffect, useState } from "react";
import { useImmerReducer } from "use-immer";
import {
  TypingContext,
  TypingStateActionType,
  initialState,
  typingReducer,
} from "../store";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/Header";
import Speed from "../components/Speed";
import { DictChapterButton } from "./components/DictChapterButton";
import WordPanel from "./components/WordPanel";
import { currentDictIdAtom } from "@/store";
import { useAtom } from "jotai";
import { isLegal } from "@/utils";
import { useWordList } from "./hooks/useWordList";
import StartButton from "../components/StartButton";
import Switcher from "../components/Switcher";
import ResultScreen from "../components/ResultScreen";

const Explore: React.FC = () => {
  const [state, dispatch] = useImmerReducer(
    typingReducer,
    structuredClone(initialState)
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentDictId, setCurrentDictId] = useAtom(currentDictIdAtom);

  const { words } = useWordList();
  console.log("words", words);


  const skipWord = useCallback(() => {
    dispatch({ type: TypingStateActionType.SKIP_WORD });
  }, [dispatch]);

  useEffect(() => {
    const onBlur = () =>
      dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: false });
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("blur", onBlur);
    };
  }, [dispatch]);

  useEffect(() => {
    // setTimeout(() => { setIsLoading(false) }, 2000)
    // console.log("state.chapterData", state.chapterData);
    state.chapterData.words?.length > 0
      ? setIsLoading(false)
      : setIsLoading(true);
  }, [state.chapterData.words]);

  useEffect(() => {
    if (words !== undefined) {
      const initialIndex = 0;

      dispatch({
        type: TypingStateActionType.SETUP_CHAPTER,
        payload: { words, shouldShuffle: true, initialIndex },
      });
    }
  }, [words]);

  useEffect(() => {
    if (!state.isTyping) {
      const onKeyDown = (e: KeyboardEvent) => {
        if (
          !isLoading &&
          e.key !== "Enter" &&
          (isLegal(e.key) || e.key === " ") &&
          !e.altKey &&
          !e.ctrlKey &&
          !e.metaKey
        ) {
          e.preventDefault();
          dispatch({
            type: TypingStateActionType.SET_IS_TYPING,
            payload: true,
          });
        }
      };
      window.addEventListener("keydown", onKeyDown);

      return () => window.removeEventListener("keydown", onKeyDown);
    }
  }, [state.isTyping, isLoading, dispatch]);

  return (
    <TypingContext.Provider value={{ state: state, dispatch }}>
      <Layout>
        <Header>
          {!isLoading && (
            <>
              <DictChapterButton />
              <Switcher />
              <StartButton isLoading={isLoading} />
            </>
          )}
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
              )}
            </div>
            <Speed />
          </div>
        </div>
      </Layout>
      {state.isFinished && <ResultScreen />}
      {/* <ResultScreen /> */}
    </TypingContext.Provider>
  );
};

export default Explore;
