import { CHAPTER_LENGTH } from "@/constants";
import {
  currentDictIdAtom,
  currentChapterAtom,
  reviewModeInfoAtom,
  currentDictInfoAtom,
  publicDictListAtom,
} from "@/store";
import type { Word, WordWithIndex } from "@/typings/index";
import { dictListQueryFn, wordListQueryFn } from "@/utils/query";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo } from "react";

export type UseWordListResult = {
  words: WordWithIndex[];
  isLoading: boolean;
  error: Error | null;
};

/**
 * Use word lists from the current selected dictionary.
 */
export function useWordList(): UseWordListResult {
  const [currentDictId, setCurrentDictId] = useAtom(currentDictIdAtom);
  const [, setDictList] = useAtom(publicDictListAtom);
  const currentDictInfo = useAtomValue(currentDictInfoAtom);
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom);
  // const { isReviewMode, reviewRecord } = useAtomValue(reviewModeInfoAtom);

  // Reset current chapter to 0, when currentChapter is greater than chapterCount.
  if (currentDictInfo && currentChapter >= currentDictInfo.chapterCount) {
    setCurrentChapter(0);
  }

  const {
    data: dictList,
    error: dictError,
    isLoading: dictLoading,
  } = useQuery({ queryKey: ["/api/v1/dictionary/public"], queryFn: dictListQueryFn });

  const {
    refetch,
    data: wordList,
    error: wordError,
    isLoading: wordLoading,
  } = useQuery({
    queryKey: ["/api/v1/word/public/dictionary", currentDictId],
    queryFn: wordListQueryFn,
    enabled: !!currentDictId,
  });

  const words: WordWithIndex[] = useMemo(() => {
    let newWords: Word[];
    console.log('newWords');

    if (wordList) {
      newWords = wordList.slice(
        currentChapter * CHAPTER_LENGTH,
        (currentChapter + 1) * CHAPTER_LENGTH
      );
    } else {
      newWords = [];
    }

    return newWords.map((word, index) => {
      let trans: string[];
      if (Array.isArray(word.trans)) {
        trans = word.trans.filter((item) => typeof item === "string");
      } else if (
        word.trans === null ||
        word.trans === undefined ||
        typeof word.trans === "object"
      ) {
        trans = [];
      } else {
        trans = [String(word.trans)];
      }
      return {
        ...word,
        index,
        trans,
      };
    });
  }, [wordList, currentChapter]);

  useEffect(() => {
    console.log("dictList", dictList);
    if (dictList && dictList.length > 0) {
      setDictList(dictList);
      if (
        !currentDictId ||
        !dictList.some((dict) => dict.id === currentDictId)
      ) {
        setCurrentDictId(dictList[0].id);
      }
      refetch();
    }
  }, [dictList]);

  return {
    words,
    isLoading: dictLoading || wordLoading,
    error: dictError || wordError,
  };
}
