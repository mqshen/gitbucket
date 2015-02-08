package util;

import java.util.LinkedList;

/**
 * Created by goldratio on 2/5/15.
 */
public class Diff {
    public static void main(String[] args) {
        diff_match_patch t = new diff_match_patch();
        LinkedList<diff_match_patch.Diff> res = t.diff_main("test t ", "test t I am a", true);
        System.out.println();
        for(diff_match_patch.Diff r : res) {
            System.out.println(r);
        }
        String tt = System.getProperty("line.separator");
        System.out.println(tt);
    }
}
