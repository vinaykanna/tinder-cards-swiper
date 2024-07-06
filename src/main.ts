class CustomPromise {
  thenCb: any;
  catchCb: any;
  finallyCb: any;

  constructor(executor: any) {
    executor(
      (data) => {
        setTimeout(() => {
          this.resolve(data);
        });
      },
      (error) => {
        setTimeout(() => {
          this.reject(error);
        });
      }
    );
  }

  resolve(data: any) {
    try {
      if (this.thenCb) {
        this.thenCb(data);
      }
    } catch (err) {
      if (this.catchCb) {
        this.catchCb(err);
      }
    } finally {
      if (this.finallyCb) {
        this.finallyCb();
      }
    }
  }

  reject(error: any) {
    if (this.catchCb) {
      this.catchCb(error);
    }

    if (this.finallyCb) {
      this.finallyCb();
    }
  }

  then(thenCb: any) {
    this.thenCb = thenCb;
    return this;
  }

  catch(catchCb: any) {
    this.catchCb = catchCb;
    return this;
  }

  finally(finallyCb: any) {
    this.finallyCb = finallyCb;
    return this;
  }
}

const promise = new Promise((resolve) => {
  console.log("promise");
  resolve("promise resolved");
});

// promise
//   .then((data) => {
//     console.log("promise first then");
//   })
//   .catch((err) => {
//     console.log({ err });
//     sdf;
//   })
//   .then(() => {
//     console.log("promise next then");
//   })
//   .catch((err) => {
//     console.log({ err });
//   })
//   .finally(() => {
//     console.log("promise finally");
//   });

const customPromise = new CustomPromise((resolve, reject) => {
  console.log("custom promise");
  resolve("custom promise resolved");
});

customPromise
  .then((data) => {
    something;
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    console.log("custom promise finally");
  });
