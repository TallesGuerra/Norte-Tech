package com.dev.tallesguerra.notes

import android.app.Application
import android.content.Context
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import org.json.JSONArray
import org.json.JSONObject

class NoteViewModel(applicaiton: Application) : AndroidViewModel(applicaiton) {


  private val prefs = applicaiton.getSharedPreferences("notes_prefs", Context.MODE_PRIVATE)

  private val KEY = "notes_list"

  var text by mutableStateOf("")
    private set

  var notes by mutableStateOf(listOf<NoteItem>())


  init {
    notes = loadNotes()
  }

  fun onTextChange(newText: String) {
    text = newText
  }

  fun save() {
    val trimmed = text.trim() //o trim remove os espaços em branco no início e no fim da string.

    if (trimmed.isEmpty()) return


    val newNote = NoteItem(
      id = System.currentTimeMillis(),
      content = trimmed,
      createdAt = System.currentTimeMillis()
    )

    val updatedNotes = notes + newNote
    notes = updatedNotes
    persist(updatedNotes)
  }

  fun clearText() {
    text = ""
  }

  fun deleteAll() {
    notes = emptyList()
    persist(notes)
  }


  private fun loadNotes(): List<NoteItem> {
    val raw = prefs.getString(KEY, null) ?: return emptyList()
    return try {
      val arr = JSONArray(raw)
      buildList {
        for (i in 0 until arr.length()) {
          var obj = arr.getJSONObject(i)
          add(
            NoteItem(
              id = obj.getLong("id"),
              content = obj.getString("content"),
              createdAt = obj.getLong("createdAt")
            )
          )
        }
      }
    }
    catch (_: Exception) {
      emptyList()
    }
}

private fun persist(list: List<NoteItem>) {
  val arr = JSONArray()
  list.forEach { note ->
    val obj = JSONObject()
      .put("id", note.id)
      .put("content", note.content)
      .put("createdAt", note.createdAt)
    arr.put(obj)
  }
  prefs.edit().putString(KEY, arr.toString()).apply()
}
}