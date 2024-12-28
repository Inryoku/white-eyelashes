import { useRef, useEffect } from "react";
import { annotate } from "rough-notation";

/**
 * Custom hook to apply rough-notation annotations.
 * @param {Object} ref - The ref object to annotate.
 * @param {boolean} isActive - Flag to activate the annotation.
 * @param {Object} options - Options for the annotation.
 * @returns {Object} - The annotation reference.
 */
export function useClickAnnotation(ref, isActive, options) {
  const annotationRef = useRef(null);

  useEffect(() => {
    // 既存のアノテーションがあれば削除
    if (annotationRef.current) {
      annotationRef.current.remove();
      annotationRef.current = null;
    }

    // isActive が true の場合のみアノテーションを適用
    if (isActive && ref.current) {
      const annotation = annotate(ref.current, options);
      annotation.show();
      annotationRef.current = annotation; // アノテーションを保存
    }

    // クリーンアップ処理
    return () => {
      if (annotationRef.current) {
        annotationRef.current.remove();
      }
    };
  }, [isActive, ref, options]);

  return annotationRef;
}
