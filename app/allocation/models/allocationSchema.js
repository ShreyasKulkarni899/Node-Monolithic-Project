module.exports = (mongoose) => {
  const allocationSchema = new mongoose.Schema(
    {
      status: {
        type: Boolean,
        default: true,
      },
      department: String,
      productItem: String,
      productType: String,
      brand: String,
      designNumber: String,
      style: String,
      pattern: String,
      fitting: String,
      fabric: String,
      storeSection: String,
      warehouseSection: String,
      counter: String,
      rackNo: String,
      quantity: Number,
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );

  const Allocation = mongoose.model("allocation", allocationSchema);
  return Allocation;
};
