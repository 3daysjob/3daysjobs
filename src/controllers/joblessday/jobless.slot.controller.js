const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const SlotService = require('../../services/joblessday/jobless.slot.service');

const slotCreation = catchAsync(async (req, res) => {
  const data = await SlotService.createJobPost(req);
  res.send(data);
});

const fetchJslots = catchAsync(async (req, res) => {
  const data = await SlotService.fetchJslots(req);
  res.send(data);
});

module.exports = {
  slotCreation,
  fetchJslots,
};
