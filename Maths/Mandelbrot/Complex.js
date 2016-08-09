var Complex = function (a, b) {
  this.real = a;
  this.imaginary = b;
  this.add = function(z) {
      return new Complex(this.real + z.real, this.imaginary + z.imaginary);
  };
  this.mul = function(z) {
      return new Complex(this.real * z.real - this.imaginary * z.imaginary,
        this.real * z.imaginary + this.imaginary * z.real);
  };
  this.size = function() {
    return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
  };
}
