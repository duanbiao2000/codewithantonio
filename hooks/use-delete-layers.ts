import { useSelf, useMutation } from "@/liveblocks.config";

/**
 * 使用删除图层的函数
 * 
 * 此函数用于删除当前用户选择的图层它通过修改存在感（presence）和存储（storage）来实现，
 * 从而确保其他用户也能看到图层被删除的状态
 * 
 * @returns 一个 mutation 函数，用于执行图层的删除操作
 */
export const useDeleteLayers = () => {
  // 获取当前用户的存在感信息，特别是关于图层选择的信息
  const selection = useSelf((me) => me.presence.selection);

  // 使用 mutation 函数来执行删除操作，该操作会基于当前的选择发生变化
  return useMutation(
    ({ storage, setMyPresence }) => {
      // 从存储中获取所有图层信息和图层 ID 列表
      const liveLayers = storage.get("layers");
      const liveLayerIds = storage.get("layerIds");

      // 遍历当前用户选择的所有图层，将它们从 liveLayers 和 liveLayerIds 中删除
      for (const id of selection) {
        liveLayers.delete(id);

        // 在图层 ID 列表中找到当前图层的索引位置
        const index = liveLayerIds.indexOf(id);

        // 如果找到了，就从列表中删除它
        if (index !== -1) {
          liveLayerIds.delete(index);
        }
      }

      // 更新当前用户的存在感信息，清除选择的图层，并将该操作添加到历史记录中
      setMyPresence({ selection: [] }, { addToHistory: true });
    },
    [selection]
  );
};