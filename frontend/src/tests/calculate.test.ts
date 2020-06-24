import { quantile } from "../utils/calculate";


describe("quantile", () => {
  describe("quantile 50%", (): void => {
    test("When just index, array length is odd", (): void => {
      const array = [1, 2, 3];
      expect(quantile(array, 50)).toBe(2);
    });
    test("When not just index, array length is even", () => {
      const array = [1, 2, 3, 4];
      expect(quantile(array, 50)).toBe(2.5);
    });
  });
  
  describe("quantile 0.3%", (): void => {
    test("When array size is 10(minimum), not just index", (): void => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      expect(quantile(array, 0.3)).toBe(1.027);
    });
    test("When array size is 1001, just index", () => {
      const array = new Array(1001);
      for (let index = 0; index < array.length; index++) {
        array[index] = index;
      }
      expect(quantile(array, 0.3)).toBe(3);
    });
  });
  
  describe("quantile 0%", (): void => {
    test("get first index", (): void => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      expect(quantile(array, 0)).toBe(1);
    });
  });
  
  describe("quantile 100%", (): void => {
    test("get last index", (): void => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      expect(quantile(array, 100)).toBe(10);
    });
  });
})

