var secondGranim = new Granim({
    element: "#canvas-image",
    name: "second-gradient",
    elToSetClassOn: ".wrapper",
    direction: "top-bottom",
    opacity: [1, 1],
    image: {
      source: "https://images3.imgbox.com/cc/5a/AAUndScI_o.jpg",
      stretchMode: ["stretch", "stretch"],
      blendingMode: "overlay"
    },
    states: {
      "default-state": {
        gradients: [["#9C27B0", "#E91E63"], ["#009688", "#8BC34A"]],
        transitionSpeed: 5000
      }
    }
});
