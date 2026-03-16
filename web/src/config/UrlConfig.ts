export const viewerConfig: any = {
  REV: {
    NG: {
      url: "/CustomViewer/NG",
      params: {
        officecode: "301",
        srno: "9823880",
        appname: "REV"
      }
    },
    OPERATION: {
      url: "/CustomViewer/operation",
      params: {
        policyno: "123456789",
        officecode: "301",
        appname: "REV",
        srno: "9823880",
        asrno: "null"
      }
    }
  },

  AND: {
    OPERATION: {
      url: "/CustomViewer/operation",
      params: {
        propno: "999824824",
        officecode: "301",
        appname: "AND",
        year: "2025"
      }
    }
  },

  PBV: {
    OPERATION: {
      url: "/CustomViewer/operation",
      params: {
        propno: "999824824",
        officecode: "301",
        appname: "PBV",
        srno: "9823880",
        asrno: "null"
      }
    }
  }
};

