"use client";

import { useEffect } from "react";

export default function GoogleTranslateSafety() {
  useEffect(() => {
    // This code patches the browser's DOM methods to prevent React from crashing
    // when Google Translate modifies the DOM (wrapping text in <font> tags).
    // Source: https://github.com/facebook/react/issues/11538#issuecomment-417504600
    // and https://martijnhols.nl/gists/everything-about-google-translate-crashing-react

    if (typeof Node === 'function' && Node.prototype) {
      const originalRemoveChild = Node.prototype.removeChild;
      Node.prototype.removeChild = function <T extends Node>(child: T): T {
        if (child.parentNode !== this) {
          if (console) {
            console.warn(
              'Cannot remove a child from a different parent. Google Translate fix applied.'
            );
          }
          return child;
        }
        return originalRemoveChild.call(this, child) as T;
      };

      const originalInsertBefore = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function <T extends Node>(
        newNode: T,
        referenceNode: Node | null
      ): T {
        if (referenceNode && referenceNode.parentNode !== this) {
          if (console) {
            console.warn(
              'Cannot insert before a reference node from a different parent. Google Translate fix applied.'
            );
          }
          return newNode;
        }
        return originalInsertBefore.call(this, newNode, referenceNode) as T;
      };
    }
  }, []);

  return null;
}